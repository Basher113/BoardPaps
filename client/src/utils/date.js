export const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
};

export const formatRelativeTime = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = now - target;
    
    if (diff < 0) return 'just now';
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (weeks === 1) return '1 week ago';
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months === 1) return '1 month ago';
    if (months < 12) return `${months} months ago`;
    
    return target.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

export const formatDistanceToNow = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;
    
    // If the date is in the past
    if (diff < 0) {
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'expired';
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days === 0 && hours === 0) return 'in less than an hour';
    if (days === 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (days === 1) return 'tomorrow';
    if (days < 7) return `in ${days} days`;
    return target.toLocaleDateString();
};

