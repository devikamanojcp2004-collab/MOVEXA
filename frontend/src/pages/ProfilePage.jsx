import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { User, Lock, Eye, EyeOff, Save, ExternalLink, Camera, Upload } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();

    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        avatar: user?.avatar || '',
        phone: user?.phone || '',
    });
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
    const fileInputRef = useRef(null);

    const setP = (k, v) => setProfileForm(prev => ({ ...prev, [k]: v }));

    // Handle local file selection → immediate preview + upload
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Instant local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Upload to server
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const { data } = await api.post('/users/upload-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setP('avatar', data.avatarUrl);
            updateUser({ avatar: data.avatarUrl });
            toast.success('Avatar uploaded!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
            setPreviewUrl(user?.avatar || '');
        } finally {
            setUploading(false);
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put('/auth/profile', profileForm);
            updateUser(data.user || data);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (passwordForm.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setSaving(true);
        try {
            await api.put('/auth/profile', { password: passwordForm.newPassword });
            toast.success('Password updated!');
            setPasswordForm({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header card */}
                <div className="bg-gradient-to-r from-black to-maroon-950 rounded-2xl p-8 mb-8 text-white shadow-xl flex items-center gap-5">
                    {/* Avatar with upload overlay */}
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-maroon-700 border-2 border-maroon-500 flex items-center justify-center text-2xl font-bold overflow-hidden">
                            {previewUrl
                                ? <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                                : user?.name?.[0]?.toUpperCase()}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute -bottom-1 -right-1 w-7 h-7 bg-maroon-600 hover:bg-maroon-500 rounded-lg flex items-center justify-center shadow-md transition-colors disabled:opacity-60"
                            title="Change avatar"
                        >
                            {uploading ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Camera className="w-3.5 h-3.5 text-white" />
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold">{user?.name}</h1>
                        <p className="text-gray-300 text-sm">{user?.email}</p>
                        <span className="inline-block mt-1 bg-maroon-700 text-white text-xs font-bold px-3 py-0.5 rounded-full capitalize">
                            {user?.role}
                            {user?.role === 'dancer' && !user?.isApproved && (
                                <span className="ml-1 text-yellow-300">· Pending Approval</span>
                            )}
                        </span>
                    </div>
                    {previewUrl && (
                        <a href={previewUrl} target="_blank" rel="noreferrer" className="ml-auto text-gray-400 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {/* Avatar Upload Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Camera className="w-5 h-5 text-maroon-600" />
                        <h2 className="text-lg font-bold text-gray-900">Profile Avatar</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                            {previewUrl
                                ? <img src={previewUrl} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                : <User className="w-8 h-8 text-gray-300" />}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-gray-500 mb-2">Upload a photo (JPG, PNG, GIF, WebP · max 5MB)</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 bg-maroon-50 hover:bg-maroon-100 text-maroon-700 font-semibold text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                            >
                                <Upload className="w-4 h-4" />
                                {uploading ? 'Uploading...' : 'Choose File'}
                            </button>
                        </div>
                    </div>

                    {/* URL fallback */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1.5">Or paste an avatar URL</label>
                        <input type="url" value={profileForm.avatar} onChange={e => { setP('avatar', e.target.value); setPreviewUrl(e.target.value); }}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 text-sm" />
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-maroon-600" />
                        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                    </div>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name *</label>
                            <input required value={profileForm.name} onChange={e => setP('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                Bio {user?.role === 'dancer' && <span className="text-gray-400 font-normal">(visible on your public profile)</span>}
                            </label>
                            <textarea rows={3} value={profileForm.bio} onChange={e => setP('bio', e.target.value)}
                                placeholder={user?.role === 'dancer' ? 'Tell students about your dance journey and teaching style...' : 'A little about yourself...'}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100 resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone (optional)</label>
                            <input type="tel" value={profileForm.phone || ''} onChange={e => setP('phone', e.target.value)}
                                placeholder="+91 9876543210"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100" />
                        </div>
                        <button type="submit" disabled={saving}
                            className="bg-maroon-700 hover:bg-maroon-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
                            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Password Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Lock className="w-5 h-5 text-maroon-600" />
                        <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">New Password</label>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                    placeholder="At least 6 characters"
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100" />
                                <button type="button" onClick={() => setShowPw(s => !s)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm New Password</label>
                            <input type={showPw ? 'text' : 'password'} value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                placeholder="Repeat new password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-100" />
                        </div>
                        <button type="submit" disabled={saving || !passwordForm.newPassword}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
                            <Lock className="w-4 h-4" />{saving ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
