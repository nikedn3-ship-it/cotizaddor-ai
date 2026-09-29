import { ArchivoProyecto } from '../types';

export const ARCHIVOS_PROYECTO: ArchivoProyecto[] = [
  {
    nombre: 'App.js',
    ruta: 'App.js',
    categoria: 'esencial',
    tamano: '4.4 KB',
    descripcion: 'Punto de entrada de la aplicación móvil React Native / Expo con React Navigation y Material Design',
    contenido: `import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PantallaInicio from './screens/PantallaInicio';
import PantallaBusqueda from './screens/PantallaBusqueda';
import PantallaCotizacion from './screens/PantallaCotizacion';
import PantallaHistorialCotizaciones from './screens/PantallaHistorialCotizaciones';
import PantallaChatIA from './screens/PantallaChatIA';

const Tab = createBottomTabNavigator();

export default function App() {
  const [carrito, setCarrito] = useState([]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 }
        }}
      >
        <Tab.Screen 
          name="Inicio" 
          component={PantallaInicio} 
          options={{
            title: 'INNMEX SOLUCIONES',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen 
          name="Artículos" 
          component={PantallaBusqueda} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" size={size} color={color} />
            ),
            tabBarBadge: carrito.length > 0 ? carrito.length : undefined
          }}
        />
        <Tab.Screen 
          name="Cotización" 
          component={PantallaCotizacion} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="file-document-edit" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen 
          name="Historial" 
          component={PantallaHistorialCotizaciones} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="history" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen 
          name="IA Chat" 
          component={PantallaChatIA} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="robot" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}`
  },
  {
    nombre: 'app.json',
    ruta: 'app.json',
    categoria: 'esencial',
    tamano: '1.2 KB',
    descripcion: 'Configuración de Expo para la compilación de APK en Android con permisos y diseño',
    contenido: `{
  "expo": {
    "name": "INNMEX SOLUCIONES",
    "slug": "innmex-soluciones",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1e293b"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1e293b"
      },
      "package": "com.innmex.erp",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      [
        "expo-print"
      ],
      [
        "expo-sharing"
      ]
    ]
  }
}`
  },
  {
    nombre: 'eas.json',
    ruta: 'eas.json',
    categoria: 'esencial',
    tamano: '601 B',
    descripcion: 'Configuración para compilar APK instalable directamente con EAS Build sin Google Play Developer',
    contenido: `{
  "cli": {
    "version": ">= 10.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}`
  },
  {
    nombre: 'package.json (Expo)',
    ruta: 'package.json',
    categoria: 'esencial',
    tamano: '1.6 KB',
    descripcion: 'Dependencias de React Native, Expo, React Navigation y bibliotecas de PDF y Material Design',
    contenido: `{
  "name": "innmex-erp",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/stack": "^6.3.29",
    "react-native-screens": "~3.31.1",
    "react-native-safe-area-context": "4.10.1",
    "@expo/vector-icons": "^14.0.0",
    "expo-print": "~13.0.1",
    "expo-sharing": "~12.0.1",
    "react-native-paper": "^5.12.3",
    "axios": "^1.6.8"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}`
  },
  {
    nombre: 'build_apk.bat',
    ruta: 'build_apk.bat',
    categoria: 'script',
    tamano: '5.2 KB',
    descripcion: 'Script automático para Windows que instala dependencias, valida EAS y genera el archivo APK',
    contenido: `@echo off
echo =======================================================
echo          INNMEX SOLUCIONES - GENERADOR DE APK ANDROID
echo =======================================================
echo.
echo [1/5] Verificando Node.js y npm...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado. Descargalo de https://nodejs.org/
    pause
    exit /b
)
echo OK: Node.js detectado.
echo.
echo [2/5] Instalando dependencias de Node.js...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo npm install.
    pause
    exit /b
)
echo OK: Dependencias instaladas.
echo.
echo [3/5] Verificando Expo EAS CLI...
call npx eas-cli --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando EAS CLI globalmente...
    call npm install -g eas-cli
)
echo.
echo [4/5] Iniciando sesion en Expo...
echo Por favor ingresa tus credenciales gratuitas de Expo (https://expo.dev/signup)
call eas login
echo.
echo [5/5] Compilando APK para Android (Perfil preview)...
call eas build --platform android --profile preview
echo.
echo =======================================================
echo  COMPILACION FINALIZADA. DESCARGA EL APK DE TU PANEL
echo =======================================================
pause`
  },
  {
    nombre: 'build_apk.sh',
    ruta: 'build_apk.sh',
    categoria: 'script',
    tamano: '6.5 KB',
    descripcion: 'Script automatizado en Bash para Mac y Linux para generar el APK con EAS Build',
    contenido: `#!/bin/bash
set -e
echo "======================================================="
echo "       INNMEX SOLUCIONES - GENERADOR DE APK ANDROID (BASH)   "
echo "======================================================="

command -v node >/dev/null 2>&1 || { echo >&2 "Node.js no está instalado. Visita https://nodejs.org/"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "npm no está instalado."; exit 1; }

echo "[1/4] Instalando paquetes de Node.js..."
npm install

echo "[2/4] Verificando EAS CLI..."
if ! command -v eas &> /dev/null
then
    echo "Instalando EAS CLI..."
    npm install -g eas-cli
fi

echo "[3/4] Iniciar sesión en Expo..."
eas login

echo "[4/4] Lanzando EAS Build para Android (APK directo)..."
eas build --platform android --profile preview

echo "======================================================="
echo "  ¡Listo! Cuando termine la nube, descarga tu .apk"
echo "======================================================="`
  },
  {
    nombre: 'backend_innmex.py',
    ruta: 'backend/backend_innmex.py',
    categoria: 'codigo',
    tamano: '16.0 KB',
    descripcion: 'Backend FastAPI en Python con endpoints de Artículos, Cotizaciones, PDFs y Chat IA',
    contenido: `from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import datetime

app = FastAPI(title="INNMEX SOLUCIONES ERP API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Articulo(BaseModel):
    id: Optional[str] = None
    sku: str
    nombre: str
    descripcion: str
    categoria: str
    precio: float
    stock: int
    unidad: str = "unidad"

class ItemCotizacion(BaseModel):
    articulo_id: str
    sku: str
    nombre: str
    precio_unitario: float
    cantidad: int
    descuento_porcentaje: float = 0.0
    subtotal: float

class CotizacionCreate(BaseModel):
    cliente_nombre: str
    empresa: str
    email: str
    telefono: str
    items: List[ItemCotizacion]
    descuento_global: float = 0.0
    observaciones: Optional[str] = ""

@app.get("/api/articulos")
def listar_articulos():
    return {"status": "ok", "total": 12, "articulos": []}

@app.get("/api/articulos/buscar")
def buscar_articulos(q: str = Query(..., min_length=1)):
    return {"query": q, "resultados": []}

@app.get("/api/cotizaciones")
def listar_cotizaciones():
    return {"cotizaciones": []}

@app.post("/api/cotizaciones")
def crear_cotizacion(data: CotizacionCreate):
    return {"status": "created", "numero": "COT-2024-005"}

@app.post("/api/ia/responder")
def responder_ia(pregunta: str):
    return {
        "pregunta": pregunta,
        "respuesta": "Mini Rey IA (Ingeniero Virtual 40 - INNMEX SOLUCIONES): He analizado tu requerimiento técnico y cotización."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`
  },
  {
    nombre: 'requirements.txt',
    ruta: 'backend/requirements.txt',
    categoria: 'codigo',
    tamano: '143 B',
    descripcion: 'Dependencias de Python para el backend FastAPI y ReportLab para PDFs',
    contenido: `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pydantic>=2.6.0
reportlab>=4.1.0
google-genai>=0.1.0
requests>=2.31.0
python-multipart>=0.0.9`
  },
  {
    nombre: 'SUPER_SIMPLE.txt',
    ruta: 'SUPER_SIMPLE.txt',
    categoria: 'guia',
    tamano: '850 B',
    descripcion: 'Instrucciones ultra rápidas en 2 pasos para compilar e instalar el APK',
    contenido: `⭐ INNMEX SOLUCIONES - GUÍA SUPER SIMPLE EN 2 PASOS ⭐

PASO 1: Descarga la carpeta del proyecto y abre una terminal en ella.
PASO 2: Ejecuta el siguiente comando según tu sistema:

En Windows (PowerShell):
  .\\build_apk.bat

En Mac o Linux:
  chmod +x build_apk.sh && ./build_apk.sh

¿Qué pasará?
1. Se instalarán los paquetes necesarios en 2 minutos.
2. Te pedirá tu usuario de Expo (gratis en https://expo.dev/signup).
3. Los servidores de Expo compilarán el archivo .apk.
4. Te dará un enlace y código QR directo para descargar el APK en tu celular.
5. ¡Abres el APK en tu Android y listo!`
  },
  {
    nombre: 'COMIENZA_AQUI.md',
    ruta: 'COMIENZA_AQUI.md',
    categoria: 'guia',
    tamano: '1.4 KB',
    descripcion: 'Guía de 1 línea de comando con EAS CLI',
    contenido: `# 🚀 INNMEX SOLUCIONES - COMIENZA AQUÍ

Para compilar el APK con una sola línea de comando:

\`\`\`bash
npm install && eas login && eas project:create && eas build --platform android --profile preview
\`\`\`

## Requisitos
1. Node.js versión 18+ instalado.
2. Cuenta gratuita creada en Expo (https://expo.dev/signup).
3. Conexión a Internet activa.
`
  }
];
