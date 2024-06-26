export type StateUser = {
    id: string
    firstName: string,
    lastName: string,
    name: string,
    username: string
};

export type StatePost = {
    id: string,
    title: string,
    content: string,
    user: string,
    date: string,
    reactions: {
        thumbsUp: number,
        hooray: number,
        heart: number,
        rocket: number,
        eyes: number,
    },
};