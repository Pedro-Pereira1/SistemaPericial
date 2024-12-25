import axios from "axios";
import Alert from "../domain/Alert";
import AlertCreationDTO from "../domain/AlertCreationDTO";
import config from "../config";

// services/UserService.ts
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  picture: string;
  experience_score: number;
  categories_preferences: string[];
};
  
  class UserService {
    // Mock repository methods
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post('http://localhost:7000/login', {
        email: email,
        password: password,
      });

      if(response.data.message === "Invalid email or password." || response.data.message === "The login is invalid"){
        throw new Error("")
      }
      

      const user: User = response.data;
      return user;
    } catch (error) {
      return null;
    }
  }

  
    async register(user: Omit<User, 'id'>): Promise<User | null> {
      try {
        const response = await axios.post('http://localhost:7000/user/sign_in', user);
        const newUser: User = response.data;
        return newUser;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
      }
    }
  
    async getAllUsers(): Promise<User[]> {
      try {
        const response = await axios.get('http://localhost:7000/user')
        const user: User[] = response.data;
        return user;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
      }    }

    async getUserById(id: string): Promise<User> {
      try {
        const response = await axios.get('http://localhost:7000/user/id/' + id)
        const user: User = response.data;
        return user;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
      }
    }

    //UserService.updateAlertStatus(user.id, alertId, 'Closed');
    async updateAlertStatus(alertId:string, newAlert: Alert): Promise<void> {
      try {
        const AlertDTO = {
          id: newAlert.id,
          title: newAlert.title,
          category: newAlert.category,
          subCategory: newAlert.subCategory,
          origin: newAlert.origin,
          assignedTo: newAlert.assignedTo,
          status: newAlert.status,
          creationTime: newAlert.creationTime,
          conclusionTime: newAlert.conclusionTime,
          description: newAlert.description,
          resolution: newAlert.resolution,
          priority: newAlert.priority
        }

        await axios.put('http://localhost:7000/updateAlert/' + alertId, AlertDTO)
        return;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error; // Rethrow the error to be handled by the caller
      }
    }

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
    async assignAlert(alert: AlertCreationDTO): Promise<Alert> {
      try {
        console.log(alert)
        const response = await axios.post('http://localhost:7000/alert/', alert)
        return response.data;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error;
      }
    }

    async updateUserPreferences(email:string, preferences:string[]) {
      try {
        const response = await axios.put(`${config.python}/user/preferences`, {
          email: email,
          preferences: preferences
        })
        return response.data;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error;
      }
    }

    async updateUser(user:User) {
      
      try {
        console.log(user)
        const response = await axios.put(`${config.python}/user`, user)
        return response.data;
      } catch (error) {
        console.error("Error posting history:", error);
        throw error;
      }
    }

  }
  
  export default new UserService();
  