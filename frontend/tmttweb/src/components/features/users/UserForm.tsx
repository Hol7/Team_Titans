'use client';

import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/input/Input';
import { Select } from '@/components/ui/select/select';
import { Button } from '@/components/ui/button/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card/Card';
import { createUserSchema, CreateUserFormValues } from '@/lib/validations/userSchema';
import { useCreateUser } from '@/lib/hooks/users';
import { useTeams } from '@/lib/hooks/teams';

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm = ({ onSuccess, onCancel }: UserFormProps) => {
  const createUserMutation = useCreateUser();
  const { data: teams } = useTeams();

  const formik = useFormik<CreateUserFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      role: 'employee',
      teamId: '',
    },
    validationSchema: toFormikValidationSchema(createUserSchema),
    onSubmit: (values) => {
      createUserMutation.mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          onSuccess?.();
        },
      });
    },
  });

  const roleOptions = [
    { value: 'employee', label: 'Employé' },
    { value: 'manager', label: 'Manager' },
  ];

  const teamOptions = [
    { value: '', label: 'Aucune équipe' },
    ...(teams?.map((team) => ({ value: team.id, label: team.name })) || []),
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          title="Nouvel utilisateur"
          subtitle="Créez un nouveau compte utilisateur"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Prénom"
              name="firstName"
              placeholder="Prénom"
              leftIcon={<Icon icon="mdi:account" className="w-5 h-5" />}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : undefined
              }
              disabled={createUserMutation.isPending}
            />

            <Input
              label="Nom"
              name="lastName"
              placeholder="Nom"
              leftIcon={<Icon icon="mdi:account" className="w-5 h-5" />}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : undefined
              }
              disabled={createUserMutation.isPending}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="email@example.com"
              leftIcon={<Icon icon="mdi:email" className="w-5 h-5" />}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : undefined
              }
              disabled={createUserMutation.isPending}
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
              disabled={createUserMutation.isPending}
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              placeholder="••••••••"
              leftIcon={<Icon icon="mdi:lock" className="w-5 h-5" />}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
              disabled={createUserMutation.isPending}
            />

            <Select
              label="Rôle"
              name="role"
              options={roleOptions}
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.role && formik.errors.role
                  ? formik.errors.role
                  : undefined
              }
              disabled={createUserMutation.isPending}
            />

            <Select
              label="Équipe (optionnel)"
              name="teamId"
              options={teamOptions}
              value={formik.values.teamId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={createUserMutation.isPending}
            />
          </div>
        </CardContent>
        <CardFooter>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={createUserMutation.isPending}
            >
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={createUserMutation.isPending}
            leftIcon={<Icon icon="mdi:plus" className="w-5 h-5" />}
          >
            Créer l'utilisateur
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};