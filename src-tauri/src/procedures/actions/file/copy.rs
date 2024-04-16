use super::{CopyRequest, CopyStrategy};
use crate::{
    common::error::AppError,
    utils::metadata::{empty_dir, is_hidden},
};
use std::{
    fs, io,
    path::{Path, PathBuf},
};
use tracing::*;
use walkdir::WalkDir;

#[instrument]
pub async fn copy_wrapper(params: CopyRequest, cleanup_deletion: bool) -> Result<(), AppError> {
    info!(?params);
    let CopyRequest {
        from,
        to,
        includes_hidden,
        strategy,
        includes_wrapping_dir,
    } = params;
    let strategy = strategy.unwrap_or_default();

    match strategy {
        CopyStrategy::BreathFirst => Err(AppError::Unimplemented),
        CopyStrategy::DepthFirst => {
            copy_depth_first(
                from,
                to,
                includes_wrapping_dir,
                includes_hidden,
                cleanup_deletion,
            )
            .await
        }
    }
}

async fn copy_depth_first<P: AsRef<Path>>(
    froms: Vec<String>,
    to: P,
    includes_wrapping_dir: bool,
    includes_hidden: bool,
    cleanup_deletion: bool,
) -> Result<(), AppError> {
    let to = to.as_ref().to_path_buf();
    let from_paths = froms.iter().map(PathBuf::from).collect::<Vec<PathBuf>>();

    for from_path in from_paths.clone() {
        // appending wrapping folder
        let to_checked_wrapper = match (includes_wrapping_dir, from_path.file_name()) {
            (true, Some(file_name)) => to.join(file_name),
            (_, _) => to.clone(),
        };

        for entry in WalkDir::new(&from_path) {
            let entry = entry?;
            let from = entry.path();
            let to = if from_path.eq(from) {
                to_checked_wrapper.clone()
            } else {
                let stripped = from.strip_prefix(&from_path)?;
                to_checked_wrapper.join(stripped)
            };

            match (includes_hidden, is_hidden(&to)?) {
                (false, true) => {
                    println!("ignored hidden file/dir {}", to.display())
                }
                _ => {
                    println!("\tcopy {} => {}", from.display(), to.display());

                    // create directories
                    if entry.file_type().is_dir() {
                        if let Err(e) = fs::create_dir_all(to) {
                            match e.kind() {
                                io::ErrorKind::AlreadyExists => {}
                                _ => return Err(AppError::Io(e)),
                            }
                        }
                    }
                    // copy files
                    else if entry.file_type().is_file() {
                        fs::copy(from, to)?;
                    }
                    // ignore the rest
                    else {
                        eprintln!("copy: ignored symlink {}", from.display());
                    }
                }
            }

            // delete source file if we're moving, empty folders later outside loop
            if cleanup_deletion && from.is_file() {
                fs::remove_file(from)?;
            }
        }
    }

    if cleanup_deletion {
        for from in from_paths {
            for entry in WalkDir::new(&from) {
                let entry = entry?;
                let entry_path = entry.path();
                println!("checking delete path: {:?}", entry_path);
                if entry_path.is_dir() && empty_dir(entry_path)? {
                    fs::remove_dir(entry_path)?;
                }
            }

            // needs to check root again to delete root incase of include_wrappind_dir
            if includes_wrapping_dir && empty_dir(&from)? {
                fs::remove_dir(from)?;
            }
        }
    }

    Ok(())
}
