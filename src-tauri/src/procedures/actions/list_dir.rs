#![allow(non_snake_case)]

use std::{fs::metadata, path::PathBuf};
use tauri::api::{dir::read_dir, path::home_dir};

use crate::utils::metadata::is_hidden;

#[taurpc::ipc_type]
pub struct ListDirIn {
    pub path: Option<String>,
    pub show_hidden: Option<bool>,
}

#[taurpc::ipc_type]
pub struct ListDirOut {
    path: String,
    short_path: String,
    children: Vec<DirItem>,
}

#[taurpc::ipc_type]
struct DirItem {
    name: String,
    is_folder: bool,
}

pub async fn list_dir(params: ListDirIn) -> Result<ListDirOut, String> {
    let home = home_dir().unwrap().to_str().unwrap().to_owned();
    let current_path: String = match params.path {
        Some(path) => path,
        // default home path
        None => home,
    };
    let dirs = match read_dir(current_path.clone(), false) {
        Ok(a) => a,
        Err(_) => vec![],
    };
    let children: Vec<DirItem> = dirs
        .iter()
        .filter(|disk_entry| match params.show_hidden {
            Some(false) => !is_hidden(&disk_entry.path).unwrap(),
            _ => true,
        })
        .map(|disk_entry| {
            let is_folder = metadata(disk_entry.path.clone()).unwrap().is_dir();
            DirItem {
                name: disk_entry.name.clone().unwrap_or_default(),
                is_folder,
            }
        })
        .collect();

    let current_cloned = PathBuf::from(current_path.clone());
    let mut short_iter = current_cloned.iter().rev();

    // FIX: unsafe unwrap
    let (f3, f2, f1) = (
        short_iter.next().unwrap(),
        short_iter.next().unwrap(),
        short_iter.next().unwrap(),
    );
    let mut short_path = PathBuf::from(f1);
    short_path.push(f2);
    short_path.push(f3);

    Ok(ListDirOut {
        path: current_path,
        short_path: short_path.to_string_lossy().into(),
        children,
    })
}
