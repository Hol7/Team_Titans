'use client';

import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { useLogin } from '@/lib/hooks/auth/useLogin';
import { loginSchema, LoginFormValues } from '@/lib/validations/authSchema';

export const LoginForm = () => {
  const loginMutation = useLogin();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="votre.email@example.com"
        leftIcon={<Icon icon="mdi:email-outline" className="w-5 h-5" />}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
        disabled={loginMutation.isPending}
      />

      <Input
        label="Mot de passe"
        type="password"
        name="password"
        placeholder="••••••••"
        leftIcon={<Icon icon="mdi:lock-outline" className="w-5 h-5" />}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
        disabled={loginMutation.isPending}
      />

      <Button
        type="submit"
        // variant="primary"
        className='bg-primary-200 bg-blue-900 hover:bg-blue-800 cursor-pointer'
        size="lg"
        fullWidth
        isLoading={loginMutation.isPending}
        leftIcon={!loginMutation.isPending && <Icon icon="mdi:login" className="w-5 h-5" />}
      >
        Se connecter
      </Button>
    </form>
  );
};