'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card/Card';
import { Input } from '@/components/ui/input/Input';
import { Button } from '@/components/ui/button/Button';
import { Modal, ModalFooter } from '@/components/ui/modal/Modal';
import { useAuthStore } from '@/lib/stores/authStore';
import { useMe } from '@/lib/hooks/auth/useMe';
import { useUpdateProfile, useDeleteAccount } from '@/lib/hooks/users';
import { updateProfileSchema } from '@/lib/validations/userSchema';
import { ROUTES } from '@/config/constants';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { data: userData, isLoading } = useMe();
  const updateProfileMutation = useUpdateProfile();
  const deleteAccountMutation = useDeleteAccount();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(updateProfileSchema),
    onSubmit: (values) => {
      updateProfileMutation.mutate(values);
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        router.push(ROUTES.AUTH.LOGIN);
        toast.success('Compte supprimé avec succès');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>

      {/* Informations générales */}
      <Card>
        <CardHeader
          title="Informations générales"
          subtitle="Vos données de compte"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                <Icon
                  icon={user?.role === 'manager' ? 'mdi:shield-crown' : 'mdi:account'}
                  className="w-5 h-5 text-primary-500"
                />
                <span className="text-gray-900 font-medium capitalize">
                  {user?.role === 'manager' ? 'Manager' : 'Employé'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membre depuis
              </label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                <Icon icon="mdi:calendar" className="w-5 h-5 text-primary-500" />
                <span className="text-gray-900 font-medium">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString('fr-FR')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de modification */}
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader
            title="Modifier mes informations"
            subtitle="Mettez à jour vos données personnelles"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom"
                name="firstName"
                placeholder="Votre prénom"
                leftIcon={<Icon icon="mdi:account" className="w-5 h-5" />}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && formik.errors.firstName
                    ? formik.errors.firstName
                    : undefined
                }
                disabled={updateProfileMutation.isPending}
              />

              <Input
                label="Nom"
                name="lastName"
                placeholder="Votre nom"
                leftIcon={<Icon icon="mdi:account" className="w-5 h-5" />}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && formik.errors.lastName
                    ? formik.errors.lastName
                    : undefined
                }
                disabled={updateProfileMutation.isPending}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="votre.email@example.com"
                leftIcon={<Icon icon="mdi:email" className="w-5 h-5" />}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : undefined
                }
                disabled={updateProfileMutation.isPending}
              />

              <Input
                label="Téléphone"
                type="tel"
                name="phone"
                placeholder="+229 XX XX XX XX"
                leftIcon={<Icon icon="mdi:phone" className="w-5 h-5" />}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : undefined
                }
                disabled={updateProfileMutation.isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => formik.resetForm()}
              disabled={updateProfileMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={updateProfileMutation.isPending}
              leftIcon={<Icon icon="mdi:content-save" className="w-5 h-5" />}
            >
              Enregistrer
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Zone de danger */}
      <Card className="border-error/20">
        <CardHeader
          title="Zone de danger"
          subtitle="Actions irréversibles sur votre compte"
        />
        <CardContent>
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
            <Icon icon="mdi:alert-circle" className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                Supprimer mon compte
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Icon icon="mdi:delete" className="w-4 h-4" />}
              >
                Supprimer mon compte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <Icon icon="mdi:alert" className="w-6 h-6 text-error flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              <strong> irréversible</strong> et toutes vos données seront perdues.
            </p>
          </div>

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteAccountMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              isLoading={deleteAccountMutation.isPending}
              leftIcon={<Icon icon="mdi:delete" className="w-5 h-5" />}
            >
              Supprimer définitivement
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}