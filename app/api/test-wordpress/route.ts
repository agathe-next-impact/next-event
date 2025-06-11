import { NextResponse } from "next/server"
import { testWordPressConnection } from "@/lib/graphql"

export async function GET() {
  try {
    const result = await testWordPressConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          details: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du test de connexion",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
