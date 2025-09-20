import { useState } from 'react';
import { Mail, Shield, X } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import useDeleteUser from '@/hooks/useDeleteUser';

const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-45" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 ">
        <div className="relative bg-dark-primary rounded-lg w-full max-w-md p-6  border shadow-md shadow-white/30 border-zinc-500 ">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Are you absolutely sure?
            </h3>
            <p className="text-sm text-zinc-500">
              This action cannot be undone. This will permanently delete your
              account and remove all associated data from our servers.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const auth = useAuth();
  const { mutate: deleteUser } = useDeleteUser();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      deleteUser();

      await auth.removeUser();
      auth.signoutRedirect();
    } catch (error) {
      console.error('Error deleting account:', error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Early return if not authenticated
  if (!auth.user) {
    return null;
  }

  return (
    <div className="w-full bg-dark-primary text-white flex md:pt-24">
      <div className="max-w-2xl mx-auto p-6 bg-dark-primary">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>

        <div className="bg-dark-secondary rounded-lg shadow">
          {/* Profile Header */}
          <div className="p-6 border-b border-zinc-500">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center text-black text-xl font-semibold">
                {auth.user.profile.name?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {auth.user.profile.name}
                </h2>
                <p className="text-gray-500">
                  Joined:{' '}
                  {new Date(
                    parseInt(
                      (auth.user?.profile as any).identities[0].dateCreated,
                    ),
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Account Information</h3>

            <div className="space-y-4">
              {/* Google Account */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">
                    Email (Google Account)
                  </p>
                  <p className="text-sm font-medium">
                    {auth.user.profile.email}
                  </p>
                </div>
              </div>

              {/* Authentication Method */}
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Sign in method</p>
                  <div className="flex items-center space-x-2">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <p className="text-sm font-medium">Google Account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Account */}
          <div className="p-6 border-t border-zinc-500">
            <h3 className="text-lg font-medium mb-4">Connected Account</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-sm text-gray-500">Connected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account */}
          <div className="p-6 border-t border-zinc-500">
            <div className="flex items-center justify-between gap-16">
              <div>
                <h3 className="text-lg font-medium text-red-600">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 bg-red-400/20 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600/20 border border-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};
