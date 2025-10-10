'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge/Badge';
import { Button } from '@/components/ui/button/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table/Table';
import { Modal, ModalFooter } from '@/components/ui/modal/Modal';
import { useUsers, useDeleteUser } from '@/lib/hooks/users';
import { User } from '@/types';
import { ROUTES } from '@/config/constants';

export const UserList = () => {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          setUserToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon icon="mdi:account-off" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Aucun utilisateur trouvé</p>
        <Button
          variant="primary"
          onClick={() => router.push(ROUTES.MANAGER.USER_NEW)}
          leftIcon={<Icon icon="mdi:plus" className="w-5 h-5" />}
        >
          Ajouter un utilisateur
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-full font-medium">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'manager' ? 'primary' : 'default'}>
                  {user.role === 'manager' ? 'Manager' : 'Employé'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(ROUTES.MANAGER.USER_DETAIL(user.id))}
                  >
                    <Icon icon="mdi:eye" className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserToDelete(user)}
                  >
                    <Icon icon="mdi:delete" className="w-5 h-5 text-error" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de confirmation */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Confirmer la suppression"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong> ?
          </p>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              disabled={deleteUserMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteUserMutation.isPending}
            >
              Supprimer
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
};