import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail'
import { apiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string,
): Promise<apiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Echoes <onboarding@resend.dev>',
            to: email,
            subject: 'Echoes Verification Code',
            react: VerificationEmail({ username, otp: verificationCode }),
        });

        if (error) {
            console.error('Resend API error:', error);
            return {
                success: false,
                message: 'Failed to send verification email',
            };
        }

        return {
            success: true,
            message: 'Verification code sent successfully',
        };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: 'Failed to send verification email',
        };
    }
}