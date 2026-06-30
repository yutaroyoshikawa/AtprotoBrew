import { atoms as a } from "@atprotobrew/common/alf";
import { AuthForm } from "@atprotobrew/common/auth/components/AuthForm";
import { BubbleBackground } from "@atprotobrew/common/core/components/Background";
import { useLocale } from "@atprotobrew/common/core/modules/i18n";
import { View } from "react-native";
import { useAuthContext } from "../../modules/auth/AuthProvider";
import { loginWithAtPassport } from "../../modules/auth/atpassport";

function Login() {
	const { login } = useAuthContext();
	const locale = useLocale();

	return (
		<View style={[a.flex_1]}>
			<BubbleBackground />

			<View style={[a.flex_1, a.flex_col, a.justify_center, a.items_center, a.p_6]}>
				<AuthForm
					onSubmit={async ({ handle, handleResolver }) => {
						await login(handle, handleResolver);
					}}
					onAtPassportLogin={() => loginWithAtPassport(locale, login)}
				/>
			</View>
		</View>
	);
}

export default Login;
