'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    LogOut,
    ShoppingBag,
    Shield,
    Eye,
    EyeOff,
    Loader2,
    Save,
    CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { usersApi } from '@/lib/api';

/* ─── Forms ────────────────────────────────────────────────────── */
interface ProfileForm {
    name: string;
    phone: string;
    address: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

type Tab = 'profile' | 'password';

/* ─── Page ──────────────────────────────────────────────────────── */
export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, logout, refreshUser } = useAuth();

    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    /* Auth guard */
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?callbackUrl=/profile');
        }
    }, [isAuthenticated, authLoading, router]);

    /* Profile form */
    const profileForm = useForm<ProfileForm>({
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
        },
    });

    /* Sync form when user loads */
    useEffect(() => {
        if (user) {
            profileForm.reset({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Password form */
    const passwordForm = useForm<PasswordForm>();
    const newPassword = passwordForm.watch('newPassword');

    /* ── Handlers ─────────────────────────────────────────────────── */
    const onSaveProfile = async (data: ProfileForm) => {
        setIsSavingProfile(true);
        try {
            await usersApi.updateProfile(data);
            // Optimistically refresh user from context
            await refreshUser();
            toast.success('Profil berhasil diperbarui!');
        } catch {
            toast.error('Gagal memperbarui profil. Coba lagi.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const onChangePassword = async (data: PasswordForm) => {
        setIsSavingPassword(true);
        try {
            await usersApi.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success('Password berhasil diubah!');
            passwordForm.reset();
        } catch {
            toast.error('Gagal mengubah password. Periksa password lama Anda.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Berhasil keluar');
        router.push('/');
    };

    /* ── Skeleton while loading ───────────────────────────────────── */
    if (authLoading) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    <Skeleton className="mb-6 h-8 w-48" />
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Skeleton className="h-64 rounded-2xl" />
                        <div className="lg:col-span-2 space-y-4">
                            <Skeleton className="h-12 rounded-xl" />
                            <Skeleton className="h-64 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    /* ── Render ───────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto max-w-4xl px-4 py-8">

                {/* Page title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold lg:text-3xl">Akun Saya</h1>
                    <p className="text-muted-foreground">Kelola informasi profil dan keamanan akun</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* ── Left: Profile card ───────────────────────────────── */}
                    <div className="space-y-4">

                        {/* Avatar + basic info */}
                        <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
                            {/* Avatar circle */}
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                                <span className="text-3xl font-bold text-primary">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold">{user?.name}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>

                            {/* Role badge */}
                            <div className="mt-3 flex justify-center">
                                {user?.role === 'ADMIN' ? (
                                    <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                                        <Shield className="h-3 w-3" /> Administrator
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="gap-1">
                                        <User className="h-3 w-3" /> Member
                                    </Badge>
                                )}
                            </div>

                            {/* Member since */}
                            <p className="mt-3 text-xs text-muted-foreground">
                                Member sejak {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                                    : 'baru saja'}
                            </p>
                        </div>

                        {/* Quick links */}
                        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                            <div className="divide-y">
                                <Link
                                    href="/orders"
                                    className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
                                >
                                    <ShoppingBag className="h-4 w-4 text-primary" />
                                    Pesanan Saya
                                </Link>
                                {user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
                                    >
                                        <Shield className="h-4 w-4 text-primary" />
                                        Dashboard Admin
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Logout */}
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Keluar dari Akun
                        </Button>
                    </div>

                    {/* ── Right: Tabs ──────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Tab switcher */}
                        <div className="flex rounded-xl border bg-card p-1 shadow-sm">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === 'profile'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <User className="h-4 w-4" />
                                Edit Profil
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === 'password'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Lock className="h-4 w-4" />
                                Ubah Password
                            </button>
                        </div>

                        {/* ── Edit Profile Tab ──────────────────────────────── */}
                        {activeTab === 'profile' && (
                            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                <h3 className="mb-5 text-base font-semibold">Informasi Pribadi</h3>

                                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-5">

                                    {/* Nama */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                {...profileForm.register('name', {
                                                    required: 'Nama wajib diisi',
                                                    minLength: { value: 3, message: 'Minimal 3 karakter' },
                                                })}
                                            />
                                        </div>
                                        {profileForm.formState.errors.name && (
                                            <p className="text-sm text-destructive">
                                                {profileForm.formState.errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email (read-only) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Email <span className="text-muted-foreground">(tidak dapat diubah)</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                                className="w-full rounded-lg border border-input bg-muted py-2.5 pl-9 pr-4 text-sm text-muted-foreground cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Telepon */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            No. Telepon <span className="text-muted-foreground">(opsional)</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="tel"
                                                placeholder="08xxxxxxxxxx"
                                                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                {...profileForm.register('phone')}
                                            />
                                        </div>
                                    </div>

                                    {/* Alamat */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Alamat <span className="text-muted-foreground">(opsional)</span>
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <textarea
                                                rows={3}
                                                placeholder="Alamat lengkap Anda"
                                                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                                {...profileForm.register('address')}
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full gap-2" disabled={isSavingProfile}>
                                        {isSavingProfile ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* ── Change Password Tab ───────────────────────────── */}
                        {activeTab === 'password' && (
                            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                <h3 className="mb-1 text-base font-semibold">Ubah Password</h3>
                                <p className="mb-5 text-sm text-muted-foreground">
                                    Gunakan password yang kuat dan unik untuk keamanan akun Anda.
                                </p>

                                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-5">

                                    {/* Current password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Password Lama</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type={showCurrentPw ? 'text' : 'password'}
                                                placeholder="Masukkan password lama"
                                                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                {...passwordForm.register('currentPassword', {
                                                    required: 'Password lama wajib diisi',
                                                })}
                                            />
                                            <button type="button" onClick={() => setShowCurrentPw(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors.currentPassword && (
                                            <p className="text-sm text-destructive">
                                                {passwordForm.formState.errors.currentPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* New password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Password Baru</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type={showNewPw ? 'text' : 'password'}
                                                placeholder="Minimal 6 karakter"
                                                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                {...passwordForm.register('newPassword', {
                                                    required: 'Password baru wajib diisi',
                                                    minLength: { value: 6, message: 'Minimal 6 karakter' },
                                                })}
                                            />
                                            <button type="button" onClick={() => setShowNewPw(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors.newPassword && (
                                            <p className="text-sm text-destructive">
                                                {passwordForm.formState.errors.newPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm new password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type={showConfirmPw ? 'text' : 'password'}
                                                placeholder="Ulangi password baru"
                                                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                {...passwordForm.register('confirmPassword', {
                                                    required: 'Konfirmasi password wajib diisi',
                                                    validate: (v) => v === newPassword || 'Password tidak sama',
                                                })}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPw(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors.confirmPassword && (
                                            <p className="text-sm text-destructive">
                                                {passwordForm.formState.errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tips */}
                                    <div className="rounded-lg bg-muted/60 p-3 space-y-1">
                                        {[
                                            'Minimal 6 karakter',
                                            'Kombinasi huruf, angka, dan simbol lebih aman',
                                            'Jangan gunakan password yang sama dengan akun lain',
                                        ].map((tip) => (
                                            <div key={tip} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                                {tip}
                                            </div>
                                        ))}
                                    </div>

                                    <Button type="submit" className="w-full gap-2" disabled={isSavingPassword}>
                                        {isSavingPassword ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Mengubah...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-4 w-4" />
                                                Ubah Password
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
