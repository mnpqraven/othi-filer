use std::path::PathBuf;

use super::list_dir::{list_dir, ListDirIn, ListDirOut};

#[taurpc::ipc_type]
pub struct BackIn {
    path: String,
}

pub async fn back(params: BackIn) -> Result<ListDirOut, String> {
    let current_path = PathBuf::from(params.path.clone());
    let mut ancestors = current_path.ancestors();
    // consumes the current dir
    ancestors.next().unwrap();
    let next_path = ancestors.next().unwrap();

    let dir = list_dir(ListDirIn {
        path: next_path.to_str().map(|e| e.to_owned()),
        show_hidden: None,
    })
    .await?;
    Ok(dir)
}
