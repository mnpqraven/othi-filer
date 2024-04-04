use std::path::PathBuf;

use super::list_dir::{list_dir, ListDirIn, ListDirOut};

#[taurpc::ipc_type]
pub struct ForwardIn {
    path: String,
    to_folder: String,
}

pub async fn forward(params: ForwardIn) -> Result<ListDirOut, String> {
    let mut current_path = PathBuf::from(params.clone().path);
    current_path.push(params.to_folder);

    let dir = list_dir(ListDirIn {
        path: Some(current_path.to_str().unwrap().to_owned()),
        show_hidden: None,
    })
    .await?;
    Ok(dir)
}
