!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\液冷执行器工具\液冷执行器工具{VERSION}"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\液冷执行器工具\液冷执行器工具{VERSION}"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\液冷执行器工具\液冷执行器工具{VERSION}"
    WriteRegExpandStr HkCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\液冷执行器工具\液冷执行器工具{VERSION}"
!macroend