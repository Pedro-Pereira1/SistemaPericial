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

  
    /*async register(user: Omit<User, 'id'>): Promise<User | null> {
      const newUser = {
        ...user
      };
      // http://localhost:7000/user
      /*
      {
        "name": "Frode Brigitta",
        "email": "tier3@shield-ai.com",
        "password": "password123",
        "phone": "1234567891",
        "role": "SOC Tier3",
        "picture": "/images/profile5.png"
      }
      
    }*/
  
    async getAllUsers(): Promise<User[]> {
      try {
        const response = await axios.get('http://localhost:7000/user')
        const user: User[] = response.data;
        return user;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
      }    }

    /*async getUserById(id: string): User | null {
      return this.users.find((u) => u.id === id) || null;
    }*/

    //UserService.updateAlertStatus(user.id, alertId, 'Closed');
    /*updateAlertStatus(userId: string, alertId: string, status: string): void {
      const alert = this.alerts.find((a) => a.id === alertId);
      if (alert) {
        alert.status = status;
      }
    }*/

    async getAlertsByUserId(userEmail: string): Promise<Alert[]> {
      try {
        const response = await axios.get('http://localhost:7000/alert/user/' + userEmail)
        const alerts: Alert[] = response.data;
        return alerts;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
      }
    }

    async getAlerts(): Promise<Alert[]> {
      try {
        const response = await axios.get('http://localhost:7000/alert/')
        const alerts: Alert[] = response.data;
        return alerts;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
      }
    }

    //UserService.assignAlert(selectedUser.id, newAlert);
    /*assignAlert(userId: string, alert: Alert): void {
      const existingAlert = this.alerts.find((a) => a.id === alert.id);
      if (!existingAlert) {
        this.alerts.push(alert);
      }
    }*/

  }
  
  export default new UserService();
  