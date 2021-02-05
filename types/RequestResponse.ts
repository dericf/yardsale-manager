export interface LoginResponse {
	STATUS: 'OK' | 'ERROR',
	MESSAGE: 'User not found' | 'Wrong password' | 'Email not confirmed',
	token: string,
	refreshToken: string,
	user: any
}