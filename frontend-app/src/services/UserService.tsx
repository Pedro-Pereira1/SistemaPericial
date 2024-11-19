// services/UserService.ts
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    picture: string;
  };
  
  class UserService {
    private users: User[] = [
      {
        id: 'UID-10001',
        name: 'John Doe',
        email: 'manager@shield-ai.com',
        password: 'password123',
        phone: '1234567890',
        role: 'SOC Manager',
        picture: '/images/profile8.png',
      },
      {
        id: 'UID-10002',
        name: 'Filib Farahild',
        email: 'tier1@shield-ai.com',
        password: 'password123',
        phone: '1234567893',
        role: 'SOC Tier1',
        picture: '/images/profile7.png',
      },
      {
        id: 'UID-10003',
        name: 'Aesop Cormacc',
        email: 'tier2@shield-ai.com',
        password: 'password123',
        phone: '1234567892',
        role: 'SOC Tier2',
        picture: '/images/profile6.png',
      },
      {
        id: 'UID-10004',
        name: 'Frode Brigitta',
        email: 'tier3@shield-ai.com',
        password: 'password123',
        phone: '1234567891',
        role: 'SOC Tier3',
        picture: '/images/profile5.png',
      },
    ];
  
    // Mock repository methods
    login(email: string, password: string): User | null {
      const user = this.users.find((u) => u.email === email && u.password === password);
      return user || null;
    }
  
    register(user: Omit<User, 'id'>): User {
      const newUser = {
        ...user,
        id: `UID-${Math.floor(Math.random() * 1000000)}`,
      };
      this.users.push(newUser);
      return newUser;
    }
  
    getAllUsers(): User[] {
      return this.users;
    }
  }
  
  export default new UserService();
  