#![allow(non_snake_case)]

use super::types::DirItem;
use crate::{
    common::error::{AppError, AppErrorIpc},
    utils::metadata::{get_permissions, is_hidden},
};
use std::{fs::metadata,  path::Path};
use tauri::api::dir::{is_dir, read_dir};

pub fn list_dir(
    path: impl AsRef<Path>,
    show_hidden: bool,
    prefix_to_strip: Option<&str>,
) -> Result<Vec<DirItem>, AppErrorIpc> {
    let Ok(dirs) = read_dir(path.as_ref(), false) else {
        // FIX: this is throwing
        return Err(AppError::GenericError("Cannot read the specified path".into()).into());
    };
    let children: Vec<DirItem> = dirs
        .iter()
        .filter(|disk_entry| {
            let hidden = match show_hidden {
                true => true,
                false => !is_hidden(&disk_entry.path).unwrap(),
            };
            // filters out jank ass windows folders like Recent or Start Menu
            let jank_windows = if cfg!(windows) && is_dir(disk_entry.path.clone()).unwrap() {
                return read_dir(disk_entry.path.clone(), false).is_ok();
            } else {
                false
            };
            hidden && !jank_windows
        })
        .map(|disk_entry| {
            let is_folder = metadata(disk_entry.path.clone()).unwrap().is_dir();
            let path = &disk_entry.path;
            let short_path: String = match &prefix_to_strip {
                Some(_strip_text) => path.file_name().unwrap().to_str().unwrap().to_owned(),
                None => path.clone().into_os_string().into_string().unwrap(),
            };

            DirItem {
                is_folder,
                path: path.to_str().unwrap().to_owned(),
                // TODO: actual short path
                short_path,
                permissions: Some(get_permissions(path.as_path())),
            }
        })
        .collect();

    Ok(children)
}
