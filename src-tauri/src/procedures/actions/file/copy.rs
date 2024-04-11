use super::{CopyRequest, CopyStrategy};
use crate::{
    common::error::{AppError, AppErrorIpc},
    utils::metadata::{empty_dir, is_hidden},
};
use std::{
    fs, io,
    path::{Path, PathBuf},
};
use walkdir::WalkDir;

pub async fn copy_wrapper(params: CopyRequest, cleanup_deletion: bool) -> Result<(), AppErrorIpc> {
    let CopyRequest {
        from,
        to,
        includes_hidden,
        strategy,
        includes_wrapping_dir,
    } = params;
    let strategy = strategy.unwrap_or(CopyStrategy::DepthFirst);

    match strategy {
        CopyStrategy::BreathFirst => todo!(),
        CopyStrategy::DepthFirst => {
            copy_depth_first(
                from,
                to,
                includes_wrapping_dir,
                includes_hidden,
                cleanup_deletion,
            )
            .await?
        }
    }

    Ok(())
}

async fn copy_depth_first<P: AsRef<Path>>(
    froms: Vec<String>,
    to: P,
    includes_wrapping_dir: bool,
    includes_hidden: bool,
    cleanup_deletion: bool,
) -> Result<(), AppErrorIpc> {
    let to = to.as_ref().to_path_buf();
    let froms = froms.iter().map(PathBuf::from).collect::<Vec<PathBuf>>();

    for from_path in froms.clone() {
        // appending wrapping folder
        let to_checked_wrapper = match includes_wrapping_dir {
            true => to.join(from_path.file_name().unwrap()),
            false => to.clone(),
        };

        for entry in WalkDir::new(&from_path) {
            // TODO: check unwrap
            let entry = entry.unwrap();
            let from = entry.path();
            let to = to_checked_wrapper.join(from.strip_prefix(&from_path).unwrap());

            match (includes_hidden, is_hidden(&to).unwrap()) {
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
                                _ => return Err(AppError::GenericError(e.to_string()).into()),
                            }
                        }
                    }
                    // copy files
                    else if entry.file_type().is_file() {
                        fs::copy(from, to).unwrap();
                    }
                    // ignore the rest
                    else {
                        eprintln!("copy: ignored symlink {}", from.display());
                    }
                }
            }

            // delete source file if we're moving, empty folders later outside loop
            if cleanup_deletion {
                println!(
                    "debuggin: from:{:?}, is_dir: {}, empty: {:?} ",
                    from,
                    from.is_dir(),
                    empty_dir(from)
                );

                if from.is_file() {
                    fs::remove_file(from).unwrap();
                }
            }
        }
    }

    if cleanup_deletion {
        for from in froms {
            for entry in WalkDir::new(&from) {
                let entry = entry.unwrap();
                let entry_path = entry.path();
                println!("checking delete path: {:?}", entry_path);
                if entry_path.is_dir() && empty_dir(entry_path).unwrap() {
                    fs::remove_dir(entry_path).unwrap();
                }
            }

            // needs to check root again to delete root incase of include_wrappind_dir
            if includes_wrapping_dir && empty_dir(&from).unwrap() {
                fs::remove_dir(from).unwrap();
            }
        }
    }

    Ok(())
}