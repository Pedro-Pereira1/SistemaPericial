import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManager.css';
import Slider from '@mui/material/Slider';
import UserService, { User } from '../../../services/UserService';

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<User[]>('http://localhost:7000/user');
        response.data = response.data.filter(user => user.role !== 'SOC Manager');

        setUsers(response.data);
        const initialScores: { [key: string]: number } = {};
        response.data.forEach((user) => {
          initialScores[user.id] = user.experience_score || 0;
        });
        setScores(initialScores);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleScoreChange = (id: string, value: number) => {
    setScores({ ...scores, [id]: value });
  };

  const handleSaveUser = async (user: User) => {
    setSaving({ ...saving, [user.id]: true });
    try {
      user.experience_score = scores[user.id]
      const updatedUser = await UserService.updateUser(user)
      console.log(`Saved score for user ${user.email}:`, scores[user.id]);
    } catch (err) {
      console.error(`Failed to save score for user ${user.id}:`, err);
    } finally {
      setSaving({ ...saving, [user.id]: false });
    }
  };

  return (
    <div className="user-manager">
      <h1>User Manager</h1>
      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="user-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <img src={user.picture} alt={user.name} className="user-picture" />
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              <p className="user-role">{user.role}</p>
              <div className="score-selector">
                <Slider
                  size="small"
                  value={scores[user.id]} // Bind to the score state
                  min={0} // Define the minimum value
                  max={100} // Define the maximum value
                  aria-label="Experience Score"
                  valueLabelDisplay="auto"
                  onChange={(event, newValue) =>
                    handleScoreChange(user.id, newValue as number)
                  }
                />
              </div>
              <button
                onClick={() => handleSaveUser(user)}
                className="save-button"
                disabled={saving[user.id]}
              >
                {saving[user.id] ? 'Saving...' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManager;
