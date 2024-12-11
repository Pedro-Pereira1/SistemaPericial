// UserManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManager.css';

interface User {
  id: string;
  name: string;
  picture: string;
  experience_score: number;
  role: string,
  email: string
}

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

  const handleSaveUser = async (id: string, email: string) => {
    setSaving({ ...saving, [id]: true });
    try {
      const updatedUser = { experience_score: scores[id] };
      //await axios.put(`/api/users/${id}`, updatedUser); // Replace with your actual API endpoint
      console.log(`Saved score for user ${email}:`, scores[id]);
    } catch (err) {
      console.error(`Failed to save score for user ${id}:`, err);
    } finally {
      setSaving({ ...saving, [id]: false });
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
                <button
                  onClick={() => handleScoreChange(user.id, Math.max(0, scores[user.id] - 1))}
                  className="arrow-button"
                  disabled={saving[user.id]}
                >
                  -
                </button>
                <span>{scores[user.id]}</span>
                <button
                  onClick={() => handleScoreChange(user.id, Math.min(10, scores[user.id] + 1))}
                  className="arrow-button"
                  disabled={saving[user.id]}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleSaveUser(user.id,user.email)}
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
