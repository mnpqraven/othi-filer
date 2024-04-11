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
    #[error("the mutex was poisoned")]
    PoisonError(String),
    #[error("{0}")]
    GenericError(String),
    #[error("{0}")]
    ChangeError(String),
}

impl From<AppError> for AppErrorIpc {
    fn from(value: AppError) -> Self {
        match value {
            AppError::Io(e) => Self {
                kind: "I/O Error".into(),
                message: e.to_string(),
            },
            AppError::PoisonError(e) => Self {
                kind: "Mutex Lock Error".into(),
                message: e,
            },
            AppError::GenericError(e) => Self {
                kind: "Error".into(),
                message: e,
            },
            AppError::ChangeError(e) => Self {
                kind: "Change Error".into(),
                message: e,
            },
        }
    }
}

// we must manually implement serde::Serialize
impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

impl<T> From<std::sync::PoisonError<T>> for AppError {
    fn from(err: std::sync::PoisonError<T>) -> Self {
        AppError::PoisonError(err.to_string())
    }
}
