import React, { useState, useEffect } from 'react';

function App() {
	const [uiState, setUiState] = useState([]);

	useEffect(() => {
		const promptsJson = [
			{
				role: 'system',
				content: 'You are a wordsmith who write 1 sentence poems',
				separator: '',
				optionsMessage: '',
				options: [],
			},
			{
				role: 'user',
				content: 'Write a 1 sentence poem about the ocean',
				separator: '',
				optionsMessage: '',
				options: [],
			},
		];

		async function generateContent() {
			let messages = [];

			for (const prompt of promptsJson) {
				if (
					prompt.role === 'system' ||
					(prompt.role === 'user' && prompt.options.length === 0)
				) {
					messages.push({
						role: prompt.role,
						content: prompt.content,
					});
					setUiState((prevPrompts) => [...prevPrompts, prompt]);

					const response = await fetch(
						'https://api.openai.com/v1/chat/completions',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer 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`,
							},
							body: JSON.stringify({
								model: 'gpt-4',
								messages,
								temperature: 1,
								max_tokens: 2216,
								top_p: 1,
								frequency_penalty: 0,
								presence_penalty: 0,
							}),
						}
					);

					const data = await response.json();

					messages.push({
						role: 'assistant',
						content: data.choices[0].message.content,
					});

					setUiState((prevPrompts) => [
						...prevPrompts,
						{
							role: 'assistant',
							content: data.choices[0].message.content,
						},
					]);
				}
			}
			console.log(messages);
		}
		generateContent();
	}, []);

	return (
		<div>
			{uiState.map((prompt, index) => (
				<div key={index}>
					<h2>{prompt.role}</h2>
					<p>{prompt.content}</p>
				</div>
			))}
		</div>
	);
}

export default App;
