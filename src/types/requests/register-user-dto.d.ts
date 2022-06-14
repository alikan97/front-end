export interface registerRequest {
    Email: string,
    FullName: string,
    Password: string,
    Roles: Array<string>,
}

enum AuthRoles {
    dev = "Dev",
    admin = "Admin"
}