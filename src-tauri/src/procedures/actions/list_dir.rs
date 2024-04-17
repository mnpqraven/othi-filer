#![allow(non_snake_case)]

use super::types::DirItem;
use crate::{
    common::{error::AppError, os::file_name},
    utils::metadata::{get_permissions, is_hidden},
};
use std::{fs::metadata, path::Path};
use tauri::api::dir::{is_dir, read_dir};
use tracing::instrument;

#[instrument(err, skip(path))]
pub fn list_dir(
    path: impl AsRef<Path>,
    show_hidden: bool,
    _prefix_to_strip: Option<&str>,
) -> Result<Vec<DirItem>, AppError> {
    let Ok(dirs) = read_dir(path.as_ref(), false) else {
        return Err(AppError::InvalidPath(
            path.as_ref().to_string_lossy().to_string(),
        ));
    };
    let children: Vec<DirItem> = dirs
        .iter()
        .filter(|disk_entry| {
            let hidden = match show_hidden {
                true => true,
                // TODO: handle unwrap
                false => !is_hidden(&disk_entry.path).unwrap_or_default(),
            };
            // filters out jank ass windows folders like Recent or Start Menu
            let jank_windows =
                if cfg!(windows) && is_dir(disk_entry.path.clone()).unwrap_or_default() {
                    return read_dir(disk_entry.path.clone(), false).is_ok();
                } else {
                    false
                };
            hidden && !jank_windows
        })
        .flat_map(|disk_entry| {
            let is_folder = metadata(disk_entry.path.clone())?.is_dir();
            let path = &disk_entry.path;

            match path.to_str() {
                Some(res) => Ok(DirItem {
                    is_folder,
                    path: res.to_owned(),
                    short_path: file_name(path)?,
                    permissions: Some(get_permissions(path.as_path())),
                }),
                None => Err(AppError::FileNameFormat),
            }
        })
        .collect();

    Ok(children)
}

#[cfg(test)]
mod tests {
    use crate::procedures::actions::{bacon::DirTestSandbox, types::DirItem};
    use std::{fs::create_dir_all, path::Path};

    use super::list_dir;

    fn setup_test_env(sandbox: &DirTestSandbox) {
        let path = Path::new(&sandbox.path()).to_path_buf();
        // create some files + folders
        let _ = std::fs::File::create(path.join("text.txt"));
        let _ = std::fs::File::create(path.join(".hidden_text.txt"));
        let _ = create_dir_all(path.join("foo").join("baz"));
        let _ = create_dir_all(path.join("bar"));
        let _ = create_dir_all(path.join(".hidden_bar"));
    }

    #[test]
    fn test_list_dir() {
        let sandbox = DirTestSandbox::init().unwrap();
        setup_test_env(&sandbox);

        let list = list_dir(Path::new(&sandbox.path()), true, None);
        assert!(list.is_ok());
        let list = list.unwrap();
        assert_eq!(list.len(), 5);
        let folder_len = list
            .iter()
            .filter(|e| e.is_folder)
            .collect::<Vec<&DirItem>>()
            .len();
        assert_eq!(folder_len, 3);
        assert_eq!(
            list.iter()
                .filter(|e| !e.is_folder)
                .collect::<Vec<&DirItem>>()
                .len(),
            2
        );

        // let _ = sandbox.clean_up();
    }

    #[test]
    fn test_list_dir_no_hidden() {
        let sandbox = DirTestSandbox::init().unwrap();
        setup_test_env(&sandbox);

        let list = list_dir(Path::new(&sandbox.path()), false, None);
        assert!(list.is_ok());
        let list = list.unwrap();
        dbg!(&list, &list.len());
        assert_eq!(list.len(), 3);
        let folder_len = list
            .iter()
            .filter(|e| e.is_folder)
            .collect::<Vec<&DirItem>>()
            .len();
        #[cfg(windows)]
        assert_eq!(folder_len, 3);
        #[cfg(not(windows))]
        assert_eq!(folder_len, 2);

        let file_len = list
            .iter()
            .filter(|e| !e.is_folder)
            .collect::<Vec<&DirItem>>()
            .len();
        #[cfg(windows)]
        assert_eq!(file_len, 2);
        #[cfg(not(windows))]
        assert_eq!(file_len, 1);

        // let _ = sandbox.clean_up();
    }
}
