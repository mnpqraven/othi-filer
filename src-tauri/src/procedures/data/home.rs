pub async fn home_dir() -> Result<String, String> {
    let dir = tauri::api::path::home_dir();

    match dir {
        Some(path_buf) => Ok(path_buf.to_str().unwrap().to_owned()),
        None => Err(String::from("unknown home")),
    }
}
