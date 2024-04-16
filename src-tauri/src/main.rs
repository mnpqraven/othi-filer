// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod common;
pub mod procedures;
pub mod utils;

use crate::procedures::create_router;
use common::error::AppError;
use tauri::Manager;

#[tokio::main]
async fn main() -> Result<(), AppError> {
    let router = create_router().await?;

    tauri::Builder::default()
        .invoke_handler(router.into_handler())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_window("main") {
                    window.open_devtools();
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
