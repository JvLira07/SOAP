import pandas as pd
import matplotlib.pyplot as plt

# Substitua pelos caminhos dos seus arquivos CSV
files = {
    10: "C:/Users/João Vitor/Desktop/SoapNew/10.csv",
    100: "C:/Users/João Vitor/Desktop/SoapNew/100.csv",
    1000: "C:/Users/João Vitor/Desktop/SoapNew/1000.csv",
}

response_times = {}

for users, file in files.items():
    # Lê os dados do arquivo CSV
    data = pd.read_csv(file)

    # Verificar os nomes das colunas
    print(data.columns)

    # Garantir que não haja espaços extras nas colunas
    data.columns = data.columns.str.strip()

    # Acessar a coluna de tempo de resposta médio
    response_times[users] = data["Average Response Time"].mean()

# Dados para o gráfico
x = list(response_times.keys())
y = list(response_times.values())

# Criar o gráfico de barras
plt.figure(figsize=(10, 6))
plt.bar(x, y, color='skyblue', width= 100)
plt.title("Tempo de Resposta Médio por Número de Usuários", fontsize=16)
plt.xlabel("Número de Usuários", fontsize=14)
plt.ylabel("Tempo de Resposta Médio (ms)", fontsize=14)
plt.grid(True, axis='y', linestyle='--', alpha=0.7)
plt.xticks(x)
plt.show()
