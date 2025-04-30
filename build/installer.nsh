!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\生产软件\新版NB软件"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\生产软件\新版NB软件"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\生产软件\新版NB软件"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\生产软件\新版NB软件"
!macroend