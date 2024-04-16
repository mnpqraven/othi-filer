#![allow(non_snake_case)]

use super::types::DirItem;
use crate::{
    common::{error::AppError, os::file_name},
    utils::metadata::{get_permissions, is_hidden},
};
use std::{fs::metadata, path::Path};
use tauri::api::dir::{is_dir, read_dir};

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
