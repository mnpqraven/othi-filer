use self::{
    back::BackIn,
    forward::ForwardIn,
    list_dir::{ListDirIn, ListDirOut},
};

pub mod back;
pub mod forward;
pub mod list_dir;

#[taurpc::procedures(path = "actions", export_to = "../src/bindings/taurpc.ts")]
pub trait DirAction {
    async fn list_dir(params: ListDirIn) -> Result<ListDirOut, String>;
    async fn forward(params: ForwardIn) -> Result<ListDirOut, String>;
    async fn back(params: BackIn) -> Result<ListDirOut, String>;
}

#[derive(Clone)]
pub struct DirActionImpl;

#[taurpc::resolvers]
impl DirAction for DirActionImpl {
    async fn list_dir(self, params: ListDirIn) -> Result<ListDirOut, String> {
        list_dir::list_dir(params).await
    }
    async fn forward(self, params: ForwardIn) -> Result<ListDirOut, String> {
        forward::forward(params).await
    }
    async fn back(self, params: BackIn) -> Result<ListDirOut, String> {
        back::back(params).await
    }
}
