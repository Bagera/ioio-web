class Avatar {
  constructor(user) {
    this.avatarSeed = user.avatarSeed;
  }
  get url() {
    return `https://avatars.dicebear.com/api/bottts/${this.avatarSeed}.svg`;
  }
  get alt() {
    return "A robot head";
  }
}

export default Avatar;
