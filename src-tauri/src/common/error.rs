#![allow(non_snake_case)]

#[derive(Debug)]
#[taurpc::ipc_type]
pub struct AppErrorIpc {
    kind: String,
    message: String,
}

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    StripPrefix(#[from] std::path::StripPrefixError),
    #[error(transparent)]
    Walkdir(#[from] walkdir::Error),
    #[error("The mutex was poisoned")]
    PoisonError(String),
    #[error("{0}")]
    GenericError(String),
    #[error("{0}")]
    ChangeError(String),
    #[error("Invalid file name format")]
    FileNameFormat,
    #[error("Invalid path: {0}")]
    InvalidPath(String),
    #[error("This feature is not yet unimplemented")]
    Unimplemented,
}

impl AppError {
    fn get_kind(&self) -> String {
        let kind = match self {
            AppError::Io(_) => "I/O Error",
            AppError::PoisonError(_) => "Mutex Lock Error",
            AppError::ChangeError(_) => "Change Error",
            _ => "Error",
        };
        kind.to_string()
    }
}

impl From<AppError> for AppErrorIpc {
    fn from(value: AppError) -> Self {
        let kind = value.get_kind();
        let message = value.to_string();
        Self { kind, message }
    }
}

impl From<&AppError> for AppErrorIpc {
    fn from(value: &AppError) -> Self {
        let kind = value.get_kind();
        let message = value.to_string();
        Self { kind, message }
    }
}

// we must manually implement serde::Serialize
impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        let ipc: AppErrorIpc = AppErrorIpc::from(self);
        ipc.serialize(serializer)
    }
}

impl<T> From<std::sync::PoisonError<T>> for AppError {
    fn from(err: std::sync::PoisonError<T>) -> Self {
        AppError::PoisonError(err.to_string())
    }
}
