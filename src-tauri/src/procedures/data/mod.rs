pub mod home;

#[taurpc::procedures(path = "data", export_to = "../src/bindings/taurpc.ts")]
pub trait Data {
    async fn home_dir() -> Result<String, String>;
}

#[derive(Clone)]
pub struct DataImpl;

#[taurpc::resolvers]
impl Data for DataImpl {
    async fn home_dir(self) -> Result<String, String> {
        home::home_dir().await
    }
}
