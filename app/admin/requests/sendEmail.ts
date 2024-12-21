import { UserPrivate } from '@/types/firebase';
import { toast } from 'sonner';

export async function sendEmail(brother: UserPrivate, sister: UserPrivate) {
  const apiKey = process.env.NEXT_PUBLIC_MAIL_API_KEY;
  const url = process.env.NEXT_PUBLIC_MAIL_API_URL;
  if (!apiKey || !url) return;
  const emailData = {
    sender: { name: 'Admin', email: 'sayyedrahat721@gmail.com' },
    to: [
      { name: brother.userName, email: brother.email },
      { name: sister.userName, email: sister.email },
    ],
    subject: 'Ilm Match: Requested User Information',
    htmlContent: emailcontent(brother, sister),
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(emailData),
    });
    if (response.status === 201) {
      toast.success('Success', {
        description: 'Email Sent Successfully',
      });
    } else {
      const error = await response.json();
      console.error('Error sending email:', error);
      toast.error('Uh oh! Email not sent.', {
        description: error,
      });
    }
  } catch (err: unknown) {
    toast.error('Uh oh! Something went wrong.', {
      description:
        err instanceof Error
          ? err.message
          : 'An error occurred while sending the email.',
    });
  }
}

const emailcontent = (brother: UserPrivate, sister: UserPrivate) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Details</title>
    <style>
        body {
            background-color: gold;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .brother,
        .sister,
        div {
            border: 1px solid black;
            padding: 10px;
            margin: 10px;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="brother">
        <strong>Brother</strong>
        <div><b>Name:</b> ${brother.userName}</div>
        <div> <b>Contact:</b>${brother.mobileNumber}</div>
        <div> <b>Wali:</b>${brother.waliName ? brother.waliName : 'N/A'}</div>
        <div> <b>Contact:</b>${brother.waliMobileNumber ? brother.waliMobileNumber : 'N/A'}</div>
    </div>

    <div class="sister">
        <strong>Sister</strong>
        <div><b>Name:</b> ${sister.userName}</div>
        <div> <b>Contact:</b> ${sister.mobileNumber ? sister.mobileNumber : 'N/A'}</div>
        <div> <b>Wali:</b> ${sister.waliName}</div>
        <div><b>Contact:</b> ${sister.waliMobileNumber}</div>
    </div>
</body>

</html>`;
};
