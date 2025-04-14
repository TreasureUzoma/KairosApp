
declare global {
  interface IUserData {
    fullName: string;
    email: string;
    profilePicUrl: string;
    totalProjects: number;
    currentRank: number;
    currentStreak: number;
  }
}

export {};
