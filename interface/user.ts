export interface LoginQuery {
  name: string,
  password: string
}


export interface UserInfo {
  name: string;
  password: string;
  email: string;
  roles: number[] | string;
  desc: string;
  token?: string;
}

export interface UpdateUserInfoType {
  name: string;
  id: number | string;
  email: string;
  roles: number[] | string[] | string;
  desc: string;
}
