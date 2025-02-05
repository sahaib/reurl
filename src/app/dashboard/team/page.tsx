'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/once-ui/components/Card';
import { Button } from '@/once-ui/components/Button';
import { Input } from '@/once-ui/components/Input';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });
      if (!response.ok) throw new Error('Failed to invite member');
      setInviteEmail('');
      // Optionally add the pending invitation to the list
      const data = await response.json();
      setMembers([...members, data]);
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const removeMember = async (id: string) => {
    try {
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove member');
      setMembers(members.filter(member => member.id !== id));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="h-16 bg-neutral-800/50"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Members</h1>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Invite New Member</h2>
          <form onSubmit={inviteMember} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <Button type="submit">
              Send Invite
            </Button>
          </form>
        </div>
      </Card>

      <div className="space-y-4">
        {members.length === 0 ? (
          <Card>
            <div className="p-6 text-center">
              <p className="text-neutral-400">No team members yet. Invite someone to get started!</p>
            </div>
          </Card>
        ) : (
          members.map((member) => (
            <Card key={member.id}>
              <div className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-medium">{member.email}</p>
                  <p className="text-sm text-neutral-400">
                    {member.role} • {member.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 