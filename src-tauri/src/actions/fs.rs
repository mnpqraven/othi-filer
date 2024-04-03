use std::{ffi::OsString, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::api::{
    dir::{read_dir, DiskEntry},
    path::home_dir,
};

#[derive(Serialize, Deserialize)]
pub struct ListDirIn {
    path: Option<String>,
    show_hidden: Option<bool>,
}

#[derive(Serialize)]
pub struct ListDirOut {
    path: String,
    // truncated path to only 3 levels
    short_path: String,
    children: Vec<DiskEntry>,
}

#[derive(Serialize, Deserialize)]
pub struct DirItem {
    name: String,
    is_folder: bool,
}

#[tauri::command]
pub async fn list_dir(params: Option<ListDirIn>) -> Result<ListDirOut, String> {
    let home = home_dir().unwrap().to_str().unwrap().to_owned();
    let current_path: String = match params {
        Some(ListDirIn { path, .. }) => path.unwrap_or(home),
        // default home path
        None => home,
    };
    let dirs = match read_dir(current_path.clone(), false) {
        Ok(a) => a,
        Err(_) => vec![],
    };
    let current_cloned = PathBuf::from(current_path.clone());
    let mut short_iter = current_cloned.iter().rev();
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
        children: dirs,
    })
}
