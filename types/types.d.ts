declare global {
  interface IUserData {
    fullName: string;
    email: string;
    profilePicUrl: string;
    totalProjects: number;
    currentRank: number;
    currentStreak: number;
  }

  interface IStreak {
    id: string;
    title: string;
    description: string;
    project: string;
    github: string;
    images: string[];
    streakCount: number;
    likes: number;
    commentsCount: number;
    user: IUserData;
    createdAt?: Date;
  }

  interface IComment {
    id: string;
    postId: string;
    user: IUserData;
    createdAt?: Date;
    content: string;
  }
}

export {};
