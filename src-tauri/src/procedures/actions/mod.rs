pub mod file;
pub mod list_dir;
pub mod reducer;
pub mod types;
pub mod ui;

#[taurpc::procedures(path = "actions", export_to = "../src/bindings/taurpc.ts")]
pub trait ActionRoot {}

#[derive(Clone)]
pub struct ActionRootImpl;

#[taurpc::resolvers]
impl ActionRoot for ActionRootImpl{}
