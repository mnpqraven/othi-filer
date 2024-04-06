#![allow(non_snake_case)]

use crate::utils::metadata::is_hidden;

use super::types::DirItem;
use std::{fs::metadata, path::Path};
use tauri::api::dir::read_dir;

pub fn list_dir(path: impl AsRef<Path>, show_hidden: bool) -> Result<Vec<DirItem>, String> {
    let dirs = match read_dir(path.as_ref(), false) {
        Ok(a) => a,
        Err(_) => vec![],
    };
    let children: Vec<DirItem> = dirs
        .iter()
        .filter(|disk_entry| match show_hidden {
            true => true,
            false => !is_hidden(&disk_entry.path).unwrap(),
        })
        .map(|disk_entry| {
            let is_folder = metadata(disk_entry.path.clone()).unwrap().is_dir();
            let path = disk_entry.path.to_str().unwrap().to_owned();
            DirItem {
                is_folder,
                path: path.clone(),
                // TODO: actual short path
                short_path: path,
                ..Default::default()
            }
        })
        .collect();

    // let current_cloned: PathBuf = path.as_ref().to_path_buf();
    // let mut short_iter = current_cloned.iter().rev();

    // // FIX: unsafe unwrap
    // let (f3, f2, f1) = (
    //     short_iter.next().unwrap(),
    //     short_iter.next().unwrap(),
    //     short_iter.next().unwrap(),
    // );
    // let mut short_path = PathBuf::from(f1);
    // short_path.push(f2);
    // short_path.push(f3);

    // Ok(ListDirOut {
    //     path: current_cloned.to_str().unwrap().to_owned(),
    //     short_path: short_path.to_string_lossy().into(),
    //     children,
    // })
    Ok(children)
}
