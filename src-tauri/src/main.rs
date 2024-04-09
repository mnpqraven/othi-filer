// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod common;
pub mod procedures;
pub mod utils;

use crate::procedures::create_router;
use tauri::Manager;

#[tokio::main]
async fn main() {
    // TODO: make unwrap safe
    let router = create_router().await.unwrap();

    tauri::Builder::default()
        .invoke_handler(router.into_handler())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("application generated")
}
