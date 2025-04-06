export default function UserAvatar({ user, size = 'md' }) {
    const getSize = () => {
      switch (size) {
        case 'sm':
          return 'h-6 w-6 text-xs';
        case 'md':
          return 'h-8 w-8 text-sm';
        case 'lg':
          return 'h-10 w-10 text-base';
        default:
          return 'h-8 w-8 text-sm';
      }
    };
    
    const sizeClass = getSize();
    const initials = user?.full_name ? 
      user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 
      'U';
    
    if (user?.avatar_url) {
      return (
        <img
          src={user.avatar_url}
          alt={user.full_name || 'User'}
          className={`${sizeClass} rounded-full object-cover`}
        />
      );
    }
    
    return (
      <div className={`${sizeClass} rounded-full bg-indigo-500 text-white flex items-center justify-center`}>
        {initials}
      </div>
    );
  }