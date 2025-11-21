"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Heading, BodyText } from "@/components/ui/typography";
import {
  signInSchema,
  signUpSchema,
  type SignInFormData,
  type SignUpFormData,
} from "@/lib/validation/auth-schemas";
import { signIn, signUp, storeAuthData } from "@/lib/services/auth.service";
import { useAuth } from "@/lib/auth-context";

export default function AuthPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { setUser } = useAuth();
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  // Sign In Form
  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: signInErrors },
    reset: resetSignIn,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Sign Up Form
  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: signUpErrors },
    reset: resetSignUp,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSignInSubmit = async (data: SignInFormData) => {
    setIsSignInLoading(true);

    try {
      const { data: authData, error } = await signIn(data);

      if (error) {
        // Handle validation errors
        if (error.errors && Array.isArray(error.errors)) {
          for (const err of error.errors) {
            toast.error(err.message);
          }
        } else {
          toast.error(t('signInFailed'), {
            description: error.message || t('invalidCredentials'),
          });
        }
        return;
      }

      if (authData) {
        // Store authentication data
        storeAuthData(authData);

        // Update auth context state
        setUser({
          userId: authData.userId,
          email: authData.email,
          firstName: authData.firstName,
          lastName: authData.lastName,
          roles: authData.roles || [],
        });

        toast.success(t('signInSuccess', { name: authData.firstName }), {
          description: t('signInSuccessDescription'),
        });

        resetSignIn();

        // Redirect to home page
        router.push('/');
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(t('signInFailed'), {
        description: t('unexpectedError'),
      });
    } finally {
      setIsSignInLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    setIsSignUpLoading(true);

    try {
      const { data: userData, error } = await signUp(data);

      if (error) {
        // Handle validation errors
        if (error.errors && Array.isArray(error.errors)) {
          for (const err of error.errors) {
            toast.error(err.message);
          }
        } else {
          toast.error(t('signUpFailed'), {
            description: error.message || t('unableToCreateAccount'),
          });
        }
        return;
      }

      if (userData) {
        toast.success(t('signUpSuccess'), {
          description: t('signUpSuccessDescription'),
        });

        resetSignUp();

        // Automatically sign in with the same credentials
        setIsSignInLoading(true);
        const { data: authData, error: signInError } = await signIn({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          toast.error(t('pleaseSignInManually'), {
            description: t('autoSignInFailed'),
          });
          setIsSignInLoading(false);
          return;
        }

        if (authData) {
          storeAuthData(authData);

          // Update auth context state
          setUser({
            userId: authData.userId,
            email: authData.email,
            firstName: authData.firstName,
            lastName: authData.lastName,
            roles: authData.roles || [],
          });

          toast.success(t('welcomeMessage', { name: authData.firstName }), {
            description: t('welcomeDescription2'),
          });

          // Redirect to home page - no setTimeout, direct navigation
          router.push('/');
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error(t('signUpFailed'), {
        description: t('unexpectedError'),
      });
    } finally {
      setIsSignUpLoading(false);
      setIsSignInLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-2">
            <Heart
              className="h-8 w-8 text-primary"
              fill="currentColor"
              aria-hidden="true"
            />
            <Heading level={2}>CharityHub</Heading>
          </Link>
          <BodyText muted>{t('brandTagline')}</BodyText>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('welcome')}</CardTitle>
            <CardDescription>
              {t('welcomeDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('signIn')}</TabsTrigger>
                <TabsTrigger value="register">{t('createAccount')}</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form
                  onSubmit={handleSubmitSignIn(onSignInSubmit)}
                  className="space-y-4 mt-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">
                      {t('email')} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        className="pl-10"
                        {...registerSignIn("email")}
                        aria-required="true"
                        aria-invalid={!!signInErrors.email}
                        aria-describedby={
                          signInErrors.email ? "signin-email-error" : undefined
                        }
                      />
                    </div>
                    {signInErrors.email && (
                      <p
                        id="signin-email-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {signInErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">
                      {t('password')} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        className="pl-10"
                        {...registerSignIn("password")}
                        aria-required="true"
                        aria-invalid={!!signInErrors.password}
                        aria-describedby={
                          signInErrors.password
                            ? "signin-password-error"
                            : undefined
                        }
                      />
                    </div>
                    {signInErrors.password && (
                      <p
                        id="signin-password-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {signInErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">{t('rememberMe')}</span>
                    </label>
                    <button
                      type="button"
                      className="text-primary hover:underline"
                    >
                      {t('forgotPassword')}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSignInLoading}
                  >
                    {isSignInLoading ? (
                      <>
                        <span className="sr-only">{t('signingIn')}</span>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        {t('signingIn')}
                      </>
                    ) : (
                      t('signIn')
                    )}
                  </Button>

                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-2">
                      {t('demoCredentials')}:
                    </p>
                    <p className="text-xs font-mono">
                      Email: demo@charityhub.com
                    </p>
                    <p className="text-xs font-mono">Password: DemoPass123!</p>
                  </div>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form
                  onSubmit={handleSubmitSignUp(onSignUpSubmit)}
                  className="space-y-4 mt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">
                        {t('firstName')} <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder={t('firstNamePlaceholder')}
                          className="pl-10"
                          {...registerSignUp("firstName")}
                          aria-required="true"
                          aria-invalid={!!signUpErrors.firstName}
                          aria-describedby={
                            signUpErrors.firstName
                              ? "signup-firstname-error"
                              : undefined
                          }
                        />
                      </div>
                      {signUpErrors.firstName && (
                        <p
                          id="signup-firstname-error"
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {signUpErrors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">
                        {t('lastName')} <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          id="signup-lastname"
                          type="text"
                          placeholder={t('lastNamePlaceholder')}
                          className="pl-10"
                          {...registerSignUp("lastName")}
                          aria-required="true"
                          aria-invalid={!!signUpErrors.lastName}
                          aria-describedby={
                            signUpErrors.lastName
                              ? "signup-lastname-error"
                              : undefined
                          }
                        />
                      </div>
                      {signUpErrors.lastName && (
                        <p
                          id="signup-lastname-error"
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {signUpErrors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      {t('email')} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        className="pl-10"
                        {...registerSignUp("email")}
                        aria-required="true"
                        aria-invalid={!!signUpErrors.email}
                        aria-describedby={
                          signUpErrors.email ? "signup-email-error" : undefined
                        }
                      />
                    </div>
                    {signUpErrors.email && (
                      <p
                        id="signup-email-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {signUpErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-dob">
                      {t('dateOfBirth')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="signup-dob"
                      type="date"
                      {...registerSignUp("dateOfBirth")}
                      aria-required="true"
                      aria-invalid={!!signUpErrors.dateOfBirth}
                      aria-describedby={
                        signUpErrors.dateOfBirth
                          ? "signup-dob-error"
                          : undefined
                      }
                    />
                    {signUpErrors.dateOfBirth && (
                      <p
                        id="signup-dob-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {signUpErrors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">
                      {t('password')} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        className="pl-10"
                        {...registerSignUp("password")}
                        aria-required="true"
                        aria-invalid={!!signUpErrors.password}
                        aria-describedby={
                          signUpErrors.password
                            ? "signup-password-error signup-password-hint"
                            : "signup-password-hint"
                        }
                      />
                    </div>
                    <p
                      id="signup-password-hint"
                      className="text-xs text-muted-foreground"
                    >
                      {t('passwordHint')}
                    </p>
                    {signUpErrors.password && (
                      <p
                        id="signup-password-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {signUpErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">
                      {t('confirmPassword')}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        className="pl-10"
                        {...registerSignUp("confirmPassword")}
                        aria-required="true"
                        aria-invalid={!!signUpErrors.confirmPassword}
                        aria-describedby={
                          signUpErrors.confirmPassword
                            ? "signup-confirm-password-error"
                            : undefined
                        }
                      />
                    </div>
                    {signUpErrors.confirmPassword && (
                      <p
                        id="signup-confirm-password-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {signUpErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-1 rounded" required />
                    <span className="text-muted-foreground">
                      {t('agreeToTerms')}{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                      >
                        {t('termsOfService')}
                      </button>{" "}
                      {t('and')}{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                      >
                        {t('privacyPolicy')}
                      </button>
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSignUpLoading}
                  >
                    {isSignUpLoading ? (
                      <>
                        <span className="sr-only">{t('creatingAccount')}</span>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        {t('creatingAccount')}
                      </>
                    ) : (
                      <>
                        {t('createAccount')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            {t('additionalInfo')}
          </p>
        </div>
      </div>
    </div>
  );
}
