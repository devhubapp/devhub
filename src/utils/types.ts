export interface IUser {
  id: string
  username: string
}

export interface INotification {
  id: string
  actor: IUser
}
