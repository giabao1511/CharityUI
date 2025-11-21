/**
 * CSV Export Utility
 * Handles exporting data to CSV format
 */

import type { Donation } from "@/types";

/**
 * Convert Vietnamese characters to Latin (remove diacritics)
 */
function vietnameseToLatin(str: string): string {
  const vietnameseMap: { [key: string]: string } = {
    à: "a", á: "a", ả: "a", ã: "a", ạ: "a",
    ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
    â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
    đ: "d",
    è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
    ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
    ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
    ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o",
    ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
    ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
    ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
    ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
    ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
    À: "A", Á: "A", Ả: "A", Ã: "A", Ạ: "A",
    Ă: "A", Ằ: "A", Ắ: "A", Ẳ: "A", Ẵ: "A", Ặ: "A",
    Â: "A", Ầ: "A", Ấ: "A", Ẩ: "A", Ẫ: "A", Ậ: "A",
    Đ: "D",
    È: "E", É: "E", Ẻ: "E", Ẽ: "E", Ẹ: "E",
    Ê: "E", Ề: "E", Ế: "E", Ể: "E", Ễ: "E", Ệ: "E",
    Ì: "I", Í: "I", Ỉ: "I", Ĩ: "I", Ị: "I",
    Ò: "O", Ó: "O", Ỏ: "O", Õ: "O", Ọ: "O",
    Ô: "O", Ồ: "O", Ố: "O", Ổ: "O", Ỗ: "O", Ộ: "O",
    Ơ: "O", Ờ: "O", Ớ: "O", Ở: "O", Ỡ: "O", Ợ: "O",
    Ù: "U", Ú: "U", Ủ: "U", Ũ: "U", Ụ: "U",
    Ư: "U", Ừ: "U", Ứ: "U", Ử: "U", Ữ: "U", Ự: "U",
    Ỳ: "Y", Ý: "Y", Ỷ: "Y", Ỹ: "Y", Ỵ: "Y",
  };

  return str
    .split("")
    .map((char) => vietnameseMap[char] || char)
    .join("");
}

/**
 * Convert donations to CSV format
 */
export function donationsToCSV(donations: Donation[]): string {
  // Define CSV headers
  const headers = [
    "Donation ID",
    "Date",
    "Donor Name",
    "Email",
    "Phone Number",
    "Amount",
    "Message",
    "Status",
    "Anonymous",
  ];

  // Create CSV rows
  const rows = donations.map((donation) => {
    const donorName = donation.isAnonymous
      ? "Anonymous"
      : donation.fullName || "N/A";
    const email = donation.isAnonymous ? "N/A" : donation.email || "N/A";
    const phone = donation.isAnonymous
      ? "N/A"
      : donation.phoneNumber || "N/A";
    const amount = parseFloat(donation.amount).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    const message = donation.message || "N/A";
    const status = donation.status?.statusName || "N/A";
    // Format date as YYYY-MM-DD HH:MM (no commas to avoid CSV column issues)
    const dateObj = new Date(donation.donateDate);
    const date = dateObj.toISOString().slice(0, 16).replace('T', ' ');

    return [
      donation.donationId,
      date,
      donorName,
      email,
      phone,
      amount,
      message,
      status,
      donation.isAnonymous ? "Yes" : "No",
    ];
  });

  // Helper function to escape CSV fields (wrap in quotes and escape internal quotes)
  const escapeCSVField = (field: string | number): string => {
    const strField = String(field);
    // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (strField.includes(',') || strField.includes('"') || strField.includes('\n')) {
      return `"${strField.replace(/"/g, '""')}"`;
    }
    return strField;
  };

  // Combine headers and rows
  const csvContent = [
    headers.map(escapeCSVField).join(","),
    ...rows.map((row) => row.map(escapeCSVField).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export donations to CSV file
 */
export function exportDonationsToCSV(
  donations: Donation[],
  campaignTitle?: string
): void {
  const csvContent = donationsToCSV(donations);
  const timestamp = new Date().toISOString().split("T")[0];

  // Convert Vietnamese to Latin and create safe filename
  const campaignName = campaignTitle
    ? vietnameseToLatin(campaignTitle)
        .replace(/[^a-z0-9]/gi, "_")
        .replace(/_+/g, "_") // Replace multiple underscores with single
        .replace(/(^_|_$)/g, "") // Remove leading/trailing underscores
        .toLowerCase()
    : "campaign";

  const filename = `donations_${campaignName}_${timestamp}.csv`;

  downloadCSV(csvContent, filename);
}
