import axios from "axios";

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

interface Alert {
  id: string;
  type: string;
  origin: string;
  assignedTo: string;
  status: string;
}
  
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
  
    private alerts: Alert[] = [
      {
        id: 'ALERT-10001',
        type: 'Multiple Login Failures',
        origin: 'United States',
        assignedTo: 'UID-10002',
        status: 'Open',
      },
      {
        id: 'ALERT-10002',
        type: 'Firewall Changes',
        origin: 'Canada',
        assignedTo: 'UID-10003',
        status: 'Open',
      },
      {
        id: 'ALERT-10003',
        type: 'Port Scan',
        origin: 'United Kingdom',
        assignedTo: 'UID-10004',
        status: 'Open',
      },
    ];

    // Mock repository methods
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post('http://localhost:7000/login', {
        email: email,
        password: password,
      });
      const user: User = response.data;
      return user;
    } catch (error) {
      console.error("Error posting history:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
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

    getUserById(id: string): User | null {
      return this.users.find((u) => u.id === id) || null;
    }

    //UserService.updateAlertStatus(user.id, alertId, 'Closed');
    updateAlertStatus(userId: string, alertId: string, status: string): void {
      const alert = this.alerts.find((a) => a.id === alertId);
      if (alert) {
        alert.status = status;
      }
    }

    getAlertsByUserId(userId: string): Alert[] {
      return this.alerts.filter((a) => a.assignedTo === userId);
    }

    getAlerts(): Alert[] {
      return this.alerts;
    }

    //UserService.assignAlert(selectedUser.id, newAlert);
    assignAlert(userId: string, alert: Alert): void {
      const existingAlert = this.alerts.find((a) => a.id === alert.id);
      if (!existingAlert) {
        this.alerts.push(alert);
      }
    }

  }
  
  export default new UserService();
  