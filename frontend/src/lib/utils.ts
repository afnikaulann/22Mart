import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Menunggu Konfirmasi',
    PROCESSING: 'Diproses',
    SHIPPED: 'Dikirim',
    DELIVERED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };
  return statusMap[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentMethodText(method: string): string {
  const methodMap: Record<string, string> = {
    COD: 'Bayar di Tempat (COD)',
    TRANSFER: 'Transfer Bank',
    EWALLET: 'E-Wallet',
  };
  return methodMap[method] || method;
}
